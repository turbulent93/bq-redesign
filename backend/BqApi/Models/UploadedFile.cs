﻿using BeautyQueenApi.Models;
using BqApi.Models.Audit;

namespace BqApi.Models
{
    public class UploadedFile// : TrackedEntity
    {
        public int Id { get; set; }
        public string Path { get; set; } = null!;
        public string Name { get; set; } = null!;
        //public int EmployeeId { get; set; }

        //public User? Employee { get; set; }
        public Promo? Promo { get; set; }
        public Gallery? Gallery { get; set; }
    }
}
