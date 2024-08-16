using Microsoft.OpenApi.Models;
using NJsonSchema.CodeGeneration.TypeScript;
using NSwag;
using NSwag.AspNetCore;
using NSwag.CodeGeneration;
using NSwag.CodeGeneration.TypeScript;
using NSwag.Generation.AspNetCore;

namespace BqApi.Codegen;

public class CodeGenerationService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IEnumerable<OpenApiDocumentRegistration> _documents;
    private readonly CodegenSettings _settings;

    public CodeGenerationService(
        IServiceProvider serviceProvider,
        IEnumerable<OpenApiDocumentRegistration> documents,
        IConfiguration config)
    {
        _serviceProvider = serviceProvider;
        _documents = documents;
        _settings = config.GetSection(nameof(CodegenSettings)).Get<CodegenSettings>()!;
    }

    private Task<NSwag.OpenApiDocument> GenerateOpenApiDocumentAsync(string documentName)
    {
        if (string.IsNullOrWhiteSpace(documentName))
            throw new ArgumentNullException(nameof(documentName));

        var documentRegistration = _documents.SingleOrDefault(r => r.DocumentName == documentName);
        if (documentRegistration?.Settings == null)
            throw new InvalidOperationException("No registered OpenAPI/Swagger document found for the document name '" + documentName + "'. Add with the AddSwagger()/AddOpenApi() methods in ConfigureServices().");

        return new AspNetCoreOpenApiDocumentGenerator(documentRegistration?.Settings)
            .GenerateAsync(_serviceProvider.CreateScope());
    }

    private async Task GenerateTypeScriptClient()
    {
        if (!Directory.Exists(_settings.GeneratePath))
        {
            Directory.CreateDirectory(_settings.GeneratePath);
        }

        var document = await GenerateOpenApiDocumentAsync("v1");

        await GenerateClient(
            document: document,
            generatePath: _settings.GeneratePath + "/client.ts",
            generateCode: (document) =>
            {
                var settings = new TypeScriptClientGeneratorSettings
                {
                    Template = TypeScriptTemplate.Axios,
                    ImportRequiredTypes = true,
                    TypeScriptGeneratorSettings = {
                        TypeStyle = TypeScriptTypeStyle.Interface,
                        TypeScriptVersion = 3.5M,
                        DateTimeType = TypeScriptDateTimeType.String,
                        NullValue = TypeScriptNullValue.Undefined,
                        GenerateConstructorInterface = false,
                        GenerateCloneMethod = false
                    },
                };
                var generator = new TypeScriptClientGenerator(document, settings);
                var code = generator.GenerateFile();
                return code;
            }
        );
    }

    private async Task GenerateClient(NSwag.OpenApiDocument document, string generatePath, Func<NSwag.OpenApiDocument, string> generateCode)
    {
        Console.WriteLine($"Generating client...");

        var code = generateCode(document);

        await File.WriteAllTextAsync(generatePath, code);
    }

    private async Task<bool> AreFileContentsEqualAsync(string content, string filePath)
    {
        return await File.ReadAllTextAsync(filePath) == content;
    }

    public async Task InitializeAsync()
    {
        //if (true)
        //    await GenerateDtoTypesAsync();
        if (_settings.GenerationEnabled)
            await GenerateTypeScriptClient();
    }
}