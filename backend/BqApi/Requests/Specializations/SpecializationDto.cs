﻿namespace BeautyQueenApi.Requests.Specializations
{
    public class SpecializationDto
    {
        public int? Id { get; set; }
        public string Name { get; set; } = null!;
        public int CreatedBy { get; set; }
    }
}
