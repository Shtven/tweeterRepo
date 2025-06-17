export class Tweet {
  id: number = 0;
  tweet: string = '';
  postedBy: string = '';
  reactionSelected?: string;
  reactionCounts?: { [key: string]: number };
}
