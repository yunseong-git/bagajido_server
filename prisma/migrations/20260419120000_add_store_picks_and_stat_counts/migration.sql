-- store_stats: 좋아요/찜 집계(실시간 증감용)
ALTER TABLE "store_stats" ADD COLUMN "like_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "store_stats" ADD COLUMN "pick_count" INTEGER NOT NULL DEFAULT 0;

-- 기존 store_likes 반영(마이그레이션 시점 스냅샷)
UPDATE "store_stats" ss
SET "like_count" = COALESCE(l.cnt, 0)
FROM (
  SELECT "store_id", COUNT(*)::int AS cnt
  FROM "store_likes"
  GROUP BY "store_id"
) l
WHERE ss."store_id" = l."store_id";

-- 찜 테이블
CREATE TABLE "store_picks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_picks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "store_picks_user_id_store_id_key" ON "store_picks"("user_id", "store_id");
CREATE INDEX "store_picks_store_id_idx" ON "store_picks"("store_id");
CREATE INDEX "store_picks_user_id_idx" ON "store_picks"("user_id");

ALTER TABLE "store_picks" ADD CONSTRAINT "store_picks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "store_picks" ADD CONSTRAINT "store_picks_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 좋아요/찜 행 변경 시 store_stats 집계 자동 동기화(CASCADE 삭제 포함, 앱 이중 UPDATE 불필요)
CREATE OR REPLACE FUNCTION trg_store_likes_touch_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE store_stats SET like_count = like_count + 1 WHERE store_id = NEW.store_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE store_stats SET like_count = GREATEST(0, like_count - 1) WHERE store_id = OLD.store_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS store_likes_stat_like_count ON store_likes;
CREATE TRIGGER store_likes_stat_like_count
AFTER INSERT OR DELETE ON store_likes
FOR EACH ROW
EXECUTE PROCEDURE trg_store_likes_touch_like_count();

CREATE OR REPLACE FUNCTION trg_store_picks_touch_pick_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE store_stats SET pick_count = pick_count + 1 WHERE store_id = NEW.store_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE store_stats SET pick_count = GREATEST(0, pick_count - 1) WHERE store_id = OLD.store_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS store_picks_stat_pick_count ON store_picks;
CREATE TRIGGER store_picks_stat_pick_count
AFTER INSERT OR DELETE ON store_picks
FOR EACH ROW
EXECUTE PROCEDURE trg_store_picks_touch_pick_count();
