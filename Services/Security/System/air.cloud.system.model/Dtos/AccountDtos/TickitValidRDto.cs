using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace air.cloud.system.model.Dtos.AccountDtos
{
    public  class TicketValidRDto
    {
        /// <summary>
        /// Ticket状态
        /// </summary>
        public TicketValidResult Status { get; set; }

    }
    public enum TicketValidResult
    {
        正常,
        失效
    }
}
