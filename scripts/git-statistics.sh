# List files
git ls-files | xargs wc -l

# Total number of rows
git log  --pretty=tformat: --numstat -- . ":(exclude)*/yarn.lock" ":(exclude)*/*.png" ":(exclude)*/*.svg" ":(exclude)*/*.xml" | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -