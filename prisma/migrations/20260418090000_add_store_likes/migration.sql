CREATE TABLE "store_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_likes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "store_likes_user_id_store_id_key" ON "store_likes"("user_id", "store_id");
CREATE INDEX "store_likes_store_id_idx" ON "store_likes"("store_id");
CREATE INDEX "store_likes_user_id_idx" ON "store_likes"("user_id");

ALTER TABLE "store_likes" ADD CONSTRAINT "store_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "store_likes" ADD CONSTRAINT "store_likes_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
