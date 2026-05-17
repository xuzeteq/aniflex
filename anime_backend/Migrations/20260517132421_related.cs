using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace anime_backend.Migrations
{
    /// <inheritdoc />
    public partial class related : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RelatedAnimes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SourceAnimeId = table.Column<int>(type: "integer", nullable: false),
                    TargetAnimeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RelatedAnimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RelatedAnimes_AnimeItem_SourceAnimeId",
                        column: x => x.SourceAnimeId,
                        principalTable: "AnimeItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RelatedAnimes_AnimeItem_TargetAnimeId",
                        column: x => x.TargetAnimeId,
                        principalTable: "AnimeItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RelatedAnimes_SourceAnimeId",
                table: "RelatedAnimes",
                column: "SourceAnimeId");

            migrationBuilder.CreateIndex(
                name: "IX_RelatedAnimes_TargetAnimeId",
                table: "RelatedAnimes",
                column: "TargetAnimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RelatedAnimes");
        }
    }
}
