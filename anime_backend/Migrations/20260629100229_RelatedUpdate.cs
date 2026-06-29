using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace anime_backend.Migrations
{
    /// <inheritdoc />
    public partial class RelatedUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "RelatedAnimes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Text",
                table: "RelatedAnimes");
        }
    }
}
