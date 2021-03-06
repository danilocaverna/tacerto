using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ApiTaCerto.Models.Usuario
{
    public class MainDbContext : DbContext
    {
        public MainDbContext(DbContextOptions<MainDbContext> options)
        : base(options)
        {   }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("TaCerto");
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // equivalent of modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
                entityType.Relational().TableName = entityType.DisplayName();
            }
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<PessoaToken> PessoaToken { get; set; }
        public DbSet<Disciplina> Disciplinas { get; set; }
        public DbSet<Instituicao> Instituicoes { get; set; }
        public DbQuery<AtividadeDisciplina> AtividadeDisciplinas { get; set; }
        public DbSet<Atividade> Atividades { get; set; }
        public DbSet<Questao> Questoes { get; set; }
    
    }
}