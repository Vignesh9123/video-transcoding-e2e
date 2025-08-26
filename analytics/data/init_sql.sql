CREATE TABLE video_views
(
    video_id String,
    viewed_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(viewed_at)
ORDER BY (video_id, viewed_at);

CREATE TABLE video_view_counts
(
    video_id String,
    views UInt64
)
ENGINE = SummingMergeTree()
ORDER BY video_id;

CREATE MATERIALIZED VIEW mv_video_view_counts
TO video_view_counts
AS
SELECT video_id, count() AS views
FROM video_views
GROUP BY video_id;