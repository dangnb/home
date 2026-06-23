using System.Data;

namespace TapHoa.Application.Interfaces;

public interface ISqlConnectionFactory
{
    IDbConnection CreateConnection();
}
