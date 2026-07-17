using System;
using System.Collections.Generic;
using System.Text.Json;
using TapHoa.Domain.Entities.Identity;

namespace TapHoa.Application.Roles;

public class RoleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Permissions { get; set; } = new List<string>();

    public static RoleDto FromEntity(Role role)
    {
        var dto = new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description
        };

        if (!string.IsNullOrEmpty(role.Permissions))
        {
            try
            {
                var perms = JsonSerializer.Deserialize<List<string>>(role.Permissions);
                if (perms != null) dto.Permissions = perms;
            }
            catch { }
        }

        return dto;
    }
}
