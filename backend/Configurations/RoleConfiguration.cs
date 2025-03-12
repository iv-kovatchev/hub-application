using Microsoft.AspNetCore.Identity;

public static class RoleConfiguration {
    public static async Task InitializeRoleAsync(IServiceProvider serviceProvider) {
        RoleManager<IdentityRole>? roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[]? roles = new[] { "Admin", "User" };

        foreach(string role in roles) {
            if (!await roleManager.RoleExistsAsync(role)) {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}