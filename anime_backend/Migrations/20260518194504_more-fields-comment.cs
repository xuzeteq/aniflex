using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace anime_backend.Migrations
{
    /// <inheritdoc />
    public partial class morefieldscomment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AnimeId",
                table: "Comments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_AnimeId",
                table: "Comments",
                column: "AnimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_AnimeItem_AnimeId",
                table: "Comments",
                column: "AnimeId",
                principalTable: "AnimeItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_AnimeItem_AnimeId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_AnimeId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "AnimeId",
                table: "Comments");
        }
    }
}
