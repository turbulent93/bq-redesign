﻿using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Tokens;
using BeautyQueenApi.Requests.Users;
using BeautyQueenApi.Services.TokenService;
using BqApi.Requests.Tokens;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/tokens")]
    [ApiController]
    public class TokensController(ITokenService tokenService) : ControllerBase
    {
        private readonly ITokenService _tokenService = tokenService;

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenDto>> Login(TokenRequest request)
        {
            return await _tokenService.Authenticate(request);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenDto>> Refresh(TokenDto request)
        {
            return await _tokenService.Refresh(request);
        }

        [HttpPost("check")]
        [AllowAnonymous]
        public async Task<ActionResult<CheckResultDto>> Check(TokenDto request)
        {
            return await _tokenService.Check(request);
        }
    
    }
}
