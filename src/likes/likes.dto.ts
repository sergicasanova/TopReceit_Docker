export class CreateLikeDto {
  userId: string;
  recipeId: number;
}

export class RemoveLikeDto {
  userId: string;
  recipeId: number;
}
