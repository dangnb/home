using System;

namespace TapHoa.Application.Infrastructure
{
    /// <summary>
    /// Provides utility methods for Dapper queries.
    /// Currently ensures that soft‑delete condition (IsDeleted = 0) is applied to raw SQL.
    /// </summary>
    public static class DapperHelper
    {
        private const string SoftDeleteClause = "IsDeleted = 0";

        /// <summary>
        /// Returns a SQL string that includes the soft‑delete filter.
        /// If the original query already contains a WHERE clause, the filter is appended using AND.
        /// Otherwise a WHERE clause is inserted before ORDER BY / GROUP BY / LIMIT if present, or appended at the end.
        /// </summary>
        public static string WithSoftDelete(string sql)
        {
            if (string.IsNullOrWhiteSpace(sql)) throw new ArgumentException("SQL cannot be null or empty.", nameof(sql));

            var trimmed = sql.TrimEnd();
            // Detect existing WHERE (case‑insensitive)
            var whereIdx = trimmed.IndexOf("WHERE", StringComparison.OrdinalIgnoreCase);
            if (whereIdx >= 0)
            {
                // Insert after existing WHERE keyword
                var insertPos = whereIdx + 5; // length of "WHERE"
                return trimmed.Insert(insertPos, $" {SoftDeleteClause} AND");
            }

            // No WHERE – add before typical trailing clauses if they exist
            var lower = trimmed.ToLowerInvariant();
            var pos = lower.IndexOf("order by");
            if (pos < 0) pos = lower.IndexOf("group by");
            if (pos < 0) pos = lower.IndexOf("limit");
            if (pos < 0)
            {
                return $"{trimmed} WHERE {SoftDeleteClause}";
            }
            else
            {
                return trimmed.Insert(pos, $" WHERE {SoftDeleteClause}");
            }
        }
    }
}
