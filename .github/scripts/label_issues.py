from github import Github
import os

# Initialize Github API client
g = Github(os.getenv('GITHUB_TOKEN'))
repo = g.get_repo(os.getenv('GITHUB_REPOSITORY'))

# Loop through open issues in the repo
for issue in repo.get_issues(state='open'):
    if "Violation against OSS" in issue.title:
        # Add 'do-not-close' label if not already present
        if 'do-not-close' not in [label.name for label in issue.labels]:
            issue.add_to_labels('do-not-close')