namespace Application.DTOs;

public record ShortDto(
    int Id,
    string Title,
    string? YoutubeUrl,
    DateTime? PublishedDate,
    DateTime CreatedAt
);

public record ProjectDto(
    int Id,
    string Title,
    string? Description,
    string Status,
    DateTime? TargetPublishDate,
    DateTime? PublishedDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int ShortsCount
);

public record ProjectDetailDto(
    int Id,
    string Title,
    string? Description,
    string Status,
    DateTime? TargetPublishDate,
    DateTime? PublishedDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<ShortDto> Shorts
);

public record CreateProjectRequest(
    string Title,
    string? Description,
    string Status,
    DateTime? TargetPublishDate
);

public record UpdateProjectRequest(
    string Title,
    string? Description,
    string Status,
    DateTime? TargetPublishDate,
    DateTime? PublishedDate
);

public record CreateShortRequest(
    string Title,
    string? YoutubeUrl,
    DateTime? PublishedDate
);
