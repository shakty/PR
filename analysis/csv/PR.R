# Analysis of the distribution of evaluation scores

## Evaluations
##############

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



# Submissions
#############

# x player
subPlayers <- read.csv(file="sub_x_round_x_player.csv", head=TRUE, sep=",")



plot.ts(subPlayers,type='o',xy.lines=FALSE)

x = summary(subPlayers)
x

hist(x)
spineplot(x)

lines(c(, y = NULL, type = "h", lwd = 2, ...)

mean(subPlayers)


#tsubPlayers = table(subPlayers)
#tsubPlayers


plot(summary(subPlayers))

# x round
subRounds <- read.csv(file="sub_x_round.csv", head=TRUE, sep=",")

subRounds

summary(subRounds)

      

# Stacked Bar Plot with Colors and Legend
counts <- table(summary(subRounds), seq(1,90))
counts
#counts <- table(subRounds,rm.NA=TRUE)


      
barplot(c(subRounds$R_02,subRounds$R_03), main="Frequencies of submissions",
  xlab="Rounds", legend = colnames(counts)) 

# col=c("darkblue","red", "lightblue")

plot(subRounds)

boxplot(subRounds)


tsubRounds = table(subRounds)
tsubRounds

summary(tsubRounds)

# x ex
subExRound <- read.csv(file="sub_x_ex_round.csv", head=TRUE, sep=",")
summary(subExRound)
      
subExRound
      
plot.ts(subExRound)


# face distance
################
      
diffFacesPlayers <- read.csv(file="diff_faces_x_round_x_player.csv", head=TRUE, sep=",")
summary(diffFacesPlayers)
boxplot(diffFacesPlayers)
      
plot.ts(diffFacesPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(diffFacesPlayers, type='o', ylim=c(0,200), plot.type="multiple")


