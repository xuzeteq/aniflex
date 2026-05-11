using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace anime_backend.Migrations
{
    /// <inheritdoc />
    public partial class LikesCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FavouritesCount",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FavouritesCount",
                table: "Users");
        }
    }
}
