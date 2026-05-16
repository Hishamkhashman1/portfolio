import type { ContributionDay } from "@/types/github-activity";

const API_BASE_URL = "https://github-contributions-api.jogruber.de/v4";

type GitHubContributionApiResponse = {
  contributions: ContributionDay[];
};

async function fetchContributionDays(
  username: string
): Promise<ContributionDay[]> {
  const response = await fetch(`${API_BASE_URL}/${username}?y=last`, {
    next: {
      revalidate: 60 * 60
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub contribution request failed with ${response.status}`);
  }

  const payload = (await response.json()) as GitHubContributionApiResponse;

  if (!Array.isArray(payload.contributions)) {
    throw new Error("GitHub contribution payload was invalid");
  }

  return payload.contributions;
}

export async function getGithubContributionDays(
  username: string
): Promise<ContributionDay[]> {
  return fetchContributionDays(username);
}
