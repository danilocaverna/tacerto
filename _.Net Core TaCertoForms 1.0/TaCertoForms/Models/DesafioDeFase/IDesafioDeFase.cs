using System;
using System.Collections.Generic;
using TaCertoForms.Models;
using Util;

namespace TaCertoForms.Models{
    public interface IDesafioDeFase{
        int Id { get; set; }
        int FaseId { get; set; }
        string Significado { get; set; }
        string Dica { get; set; }
    }
}