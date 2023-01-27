import { Applications } from "@voting";
import { SingleChoiceVote, SingleChoiceVoteScope, Choice } from "./types";

export default interface ISingleChoiceProposal {
  scope: SingleChoiceVoteScope;
  chains: Applications[];
  // for mutli-chain applcations -
  // len(votes[].scores) == len(chains)
  votes: SingleChoiceVote[];
  scores: number[];
  scoresByChains: number[][];
  scoresTotal: number;
  dominantChoice: Choice;
}

export default class SingleChoiceProposal {
  static from(
    scope: SingleChoiceVoteScope,
    chains: Applications[],
    votes: SingleChoiceVote[],
    preProcess: boolean
  ) {
    const self = new this();

    self.scope = scope;
    self.chains = chains;
    self.votes = votes;

    if (preProcess) {
      self.process();
    }

    return self;
  }

  static isValidChoice(
    scope: SingleChoiceVoteScope,
    voteChoice: number
  ): boolean {
    return (
      typeof voteChoice === "number" &&
      scope.choices[voteChoice - 1] !== undefined
    );
  }

  process() {
    this.getScores();
    this.getScoresByChains();
    this.getScoresTotal();
    this.getDominantChoice();
  }

  getValidVotes(): SingleChoiceVote[] {
    return this.votes.filter((vote) =>
      SingleChoiceProposal.isValidChoice(this.scope, vote.choice)
    );
  }

  getScores(): number[] {
    const scores = this.scope.choices.map((_choice, i) => {
      const votes = this.getValidVotes().filter(
        (vote) => vote.choice === i + 1
      );
      const balanceSum = votes.reduce((a, b) => a + b.balance, 0);
      return balanceSum;
    });

    this.scores = scores;
    return scores;
  }

  getScoresByChains(): number[][] {
    const scoresByChains = this.scope.choices.map((_, i) => {
      const scores = this.chains.map((_strategy, sI) => {
        const votes = this.getValidVotes().filter(
          (vote) => vote.choice === i + 1
        );
        const scoreSum = votes.reduce((a, b) => a + b.scores[sI], 0);
        return scoreSum;
      });
      return scores;
    });

    this.scoresByChains = scoresByChains;
    return scoresByChains;
  }

  getScoresTotal(): number {
    const scoresTotal = this.getValidVotes().reduce((a, b) => a + b.balance, 0);

    this.scoresTotal = scoresTotal;
    return scoresTotal;
  }

  getDominantChoice(): Choice {
    const choice =
      this.scope.choices[
        this.scores.reduce(
          (acc, item, index) => (item > acc[0] ? [item, index] : acc),
          [this.scores[0], 0]
        )[1]
      ];

    this.dominantChoice = choice;
    return choice;
  }
}
