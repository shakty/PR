# Analysis of the distribution of evaluation scores

# Working Dir
rm(list=ls())
setwd('/home/stefano/PR/analysis/csv') 

# Load file
players <- read.csv(file="test.csv", head=TRUE, sep=",")
summary(players)
boxplot(players)

ohne10 = players
rm(ohne10$P_10)

jpeg('img/players_boxplot.jpg',quality=100,width=600)
boxplot(players,main="Distribution of evaluation scores per player")
dev.off()



# Time Series
jpeg('img/players_boxplot.jpg',quality=100,width=600)
plot.ts(players, type='o',ylim=c(0,10))
dev.off()
#Mean = mean(mean(players))
#Mean
#abline(h=Mean)

# ROUNDS
rounds <- read.csv(file="eva_x_round.csv", head=TRUE, sep=",")
summary(rounds)
jpeg('img/round_evas_boxplot.jpg',quality=100,width=600)
boxplot(rounds, main="Distribution of evaluation scores per round",ylab="Evaluation score")
dev.off()

meanRounds = apply(rounds, MARGIN=2, mean)
meanRounds
#jpeg('img/round_evas_mean.jpg',quality=100,width=600)
plot(meanRounds, main="Evaluation mean per round",ylab="Evaluation score",ylim=c(0,10))
lines(meanRounds)
abline(lm(c(1:30) ~ meanRounds))
#dev.off()

varRounds = apply(rounds, MARGIN=2, sd)
varRounds
jpeg('img/round_evas_var.jpg',quality=100,width=600)
plot(varRounds, main="Evaluation standard deviation per round",ylab="Evaluation score",ylim=c(0,10))
lines(varRounds)
dev.off()     




