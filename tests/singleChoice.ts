import SingleChoiceVotingProposal, {
  ISingleChoiceProposal,
} from "@voting/singleChoice";
import * as assert from "assert";
import * as fs from "fs/promises";

(async () => {
  const stateFile = await fs.readFile(process.argv[2]);
  const state: ISingleChoiceProposal = JSON.parse(stateFile.toString());
  const proposal = SingleChoiceVotingProposal.from(
    state.scope,
    state.chains,
    state.votes,
    true
  );

  assert.deepStrictEqual(
    state.scoresByChains,
    proposal.scoresByChains,
    "inconsistent scores by chains"
  );

  assert.equal(
    state.dominantChoice,
    proposal.dominantChoice,
    `inconsistent dominant choice. exp: ${proposal.dominantChoice} got: ${state.dominantChoice}`
  );
})();

