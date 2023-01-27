export type Choice = string;

export type SingleChoiceVoteScope = {
  choices: Choice[];
};

export type SingleChoiceVote = {
  choice: number;
  balance: number;
  scores: number[];
};
