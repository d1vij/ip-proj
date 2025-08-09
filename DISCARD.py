# classes where a candidate got least vote (non zero)

for post_name, post_df in result_dataframes.items():
    print("\n", chalk.green(name), sep="")

    # Logic : Select the min value from the rows whose votes are greater than 0
    print(post_df[post_df > 0].idxmin())

    # equivalent sql for verification
    for name in post_df.columns:
        print(chalk.yellow(name))

        query(
            f"select min({name}) as 'Got Votes', class from {replace_spaces(post_name)} where {name} > 0"
        )
        print()
