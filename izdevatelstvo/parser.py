# anime_parser.py

import requests
import time
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

# ============= ENUM (соответствуют твоим C# enum) =============
class Status(str, Enum):
    ВЫШЛО = "Вышло"
    ОНГОИНГ = "Онгоинг"
    АНОНС = "Анонс"

class Type(str, Enum):
    СЕРИАЛ = "Сериал"
    ФИЛЬМ = "Фильм"
    OVA = "OVA"
    ONA = "ONA"

class Season(str, Enum):
    ЗИМА = "Зима"
    ВЕСНА = "Весна"
    ЛЕТО = "Лето"
    ОСЕНЬ = "Осень"

# ============= ТВОЯ МОДЕЛЬ ANIME =============
@dataclass
class AnimeItem:
    """Модель аниме, полностью совместимая с твоей C# Entity"""
    id: int
    title: str
    originalTitle: str
    description: str
    episodes: Optional[int]
    maxEpisodes: Optional[int]
    rating: float  # decimal в C# -> float в Python
    releaseYear: Optional[int]
    studio: str
    posterUrl: str
    averageRating: float
    ratingsCount: int
    season: Optional[Season]
    status: Status
    type: Type
    createdAt: str  # ISO формат для DateTime


# ============= ПАРСЕР SHIKIMORI =============
class ShikimoriParser:
    """Парсер для наполнения твоей модели данными из Shikimori"""
    
    BASE_URL = "https://shikimori.one/api/animes"
    
    # Маппинг статусов из Shikimori в твои
    STATUS_MAP = {
        'anons': Status.АНОНС,
        'ongoing': Status.ОНГОИНГ,
        'released': Status.ВЫШЛО,
    }
    
    # Маппинг типов
    TYPE_MAP = {
        'tv': Type.СЕРИАЛ,
        'movie': Type.ФИЛЬМ,
        'ova': Type.OVA,
        'ona': Type.ONA,
    }
    
    # Маппинг сезонов (по месяцу начала)
    def _get_season(self, aired_on: Optional[Dict]) -> Optional[Season]:
        if not aired_on or not aired_on.get('aired_on'):
            return None
        
        try:
            # Парсим дату из строки "2024-01-15"
            date_str = aired_on['aired_on']
            month = int(date_str.split('-')[1])
            
            if month in [12, 1, 2]:
                return Season.ЗИМА
            elif month in [3, 4, 5]:
                return Season.ВЕСНА
            elif month in [6, 7, 8]:
                return Season.ЛЕТО
            elif month in [9, 10, 11]:
                return Season.ОСЕНЬ
        except:
            return None
        
        return None
    
    def __init__(self, delay: float = 1.0):
        self.session = requests.Session()
        self.delay = delay
        # Добавляем заголовок, чтобы нас не блокировали
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def _request(self, anime_id: int) -> Optional[Dict[str, Any]]:
        """Делаем запрос к Shikimori API"""
        try:
            url = f"{self.BASE_URL}/{anime_id}"
            print(f"📡 Запрос: {url}")
            
            response = self.session.get(url)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                print(f"⚠️ Слишком много запросов! Ждём 5 секунд...")
                time.sleep(5)
                return self._request(anime_id)
            else:
                print(f"❌ Ошибка {response.status_code} для ID {anime_id}")
                return None
                
        except Exception as e:
            print(f"❌ Исключение: {e}")
            return None
    
    def parse_anime(self, anime_id: int) -> Optional[AnimeItem]:
        """Парсит аниме по ID и возвращает объект твоей модели"""
        
        data = self._request(anime_id)
        if not data:
            return None
        
        try:
            # Получаем студию (первую из списка)
            studio = ""
            studios = data.get('studios', [])
            if studios:
                studio = studios[0].get('name', '')
            
            # Получаем год релиза
            release_year = None
            aired_on = data.get('aired_on')
            if aired_on:
                try:
                    release_year = int(aired_on.split('-')[0])
                except:
                    pass
            
            # Получаем количество эпизодов
            episodes = data.get('episodes')
            max_episodes = data.get('episodes_aired') or episodes
            
            # Создаём объект твоей модели
            anime = AnimeItem(
                id=data.get('id', anime_id),
                title=data.get('russian', data.get('name', 'Без названия')),
                originalTitle=data.get('name', ''),
                description=data.get('description_html', data.get('description', '')),
                episodes=episodes,
                maxEpisodes=max_episodes,
                rating=float(data.get('score', 0)),
                releaseYear=release_year,
                studio=studio,
                posterUrl=data.get('image', {}).get('original', ''),
                averageRating=float(data.get('score', 0)),
                ratingsCount=data.get('score_count', 0),
                season=self._get_season(data),
                status=self.STATUS_MAP.get(data.get('status', ''), Status.АНОНС),
                type=self.TYPE_MAP.get(data.get('kind', ''), Type.СЕРИАЛ),
                createdAt=datetime.now().isoformat()
            )
            
            print(f"✅ Спарсено: {anime.title} (ID: {anime.id})")
            return anime
            
        except Exception as e:
            print(f"❌ Ошибка при парсинге ID {anime_id}: {e}")
            return None
    
    def parse_multiple(self, anime_ids: List[int]) -> List[AnimeItem]:
        """Парсит несколько аниме по списку ID"""
        results = []
        
        for anime_id in anime_ids:
            anime = self.parse_anime(anime_id)
            if anime:
                results.append(anime)
            
            # Пауза между запросами
            time.sleep(self.delay)
        
        print(f"\n📊 Итого: спарсено {len(results)} из {len(anime_ids)}")
        return results


# ============= ИСПОЛЬЗОВАНИЕ =============
def main():
    # Создаём парсер
    parser = ShikimoriParser(delay=1.0)
    
    # Список ID популярных аниме для начала
    popular_ids = [
        20,    # Наруто
        21,    # Ван Пис
        11061, # Атака Титанов
        42229, # Клинок рассекающий демонов
        1,     # Ковбой Бибоп
        5,     # Евангелион
        30276, # Врата Штейна
    ]
    
    # Парсим
    anime_list = parser.parse_multiple(popular_ids)
    
    # Выводим результат
    print("\n" + "="*50)
    print("РЕЗУЛЬТАТ ПАРСИНГА")
    print("="*50)
    
    for anime in anime_list:
        print(f"\n📺 {anime.title}")
        print(f"   Оригинал: {anime.originalTitle}")
        print(f"   Серий: {anime.episodes}")
        print(f"   Рейтинг: {anime.rating}")
        print(f"   Год: {anime.releaseYear}")
        print(f"   Студия: {anime.studio}")
        print(f"   Постер: {anime.posterUrl}")
        print(f"   Статус: {anime.status.value}")
        print(f"   Тип: {anime.type.value}")
        print(f"   Сезон: {anime.season.value if anime.season else 'Неизвестно'}")
    
    # Сохраняем в JSON (чтобы потом отправить в C#)
    import json
    
    # Конвертируем в JSON-совместимый формат
    json_data = []
    for anime in anime_list:
        json_data.append({
            "id": anime.id,
            "title": anime.title,
            "originalTitle": anime.originalTitle,
            "description": anime.description,
            "episodes": anime.episodes,
            "maxEpisodes": anime.maxEpisodes,
            "rating": anime.rating,
            "releaseYear": anime.releaseYear,
            "studio": anime.studio,
            "posterUrl": anime.posterUrl,
            "averageRating": anime.averageRating,
            "ratingsCount": anime.ratingsCount,
            "season": anime.season.value if anime.season else None,
            "status": anime.status.value,
            "type": anime.type.value,
            "createdAt": anime.createdAt
        })
    
    # Сохраняем в файл
    with open("anime_data.json", "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Данные сохранены в anime_data.json")
    
    # Выводим команду для отправки в твой C# API
    print("\n🚀 Чтобы отправить в твой C# API, выполни POST-запрос:")
    print("   curl -X POST http://localhost:5000/api/anime/import -H 'Content-Type: application/json' -d @anime_data.json")


if __name__ == "__main__":
    main()