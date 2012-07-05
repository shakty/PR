# Init
source('PR_init.R')

## Evaluations
##############

# Load file
players <- read.csv(file="test.csv", head=TRUE, sep=",")
summary(players)
boxplot(players)

ohne10 = players
rm(ohne10$P_10)

jpeg('eva/img/players_boxplot.jpg',quality=100,width=600)
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
jpeg('eva/img/round_evas_boxplot.jpg',quality=100,width=600)
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
jpeg('eva/img/round_evas_var.jpg',quality=100,width=600)
plot(varRounds, main="Evaluation standard deviation per round",ylab="Evaluation score",ylim=c(0,10))
lines(varRounds)
dev.off()     



# Submissions
#############

# x player
subPlayers <- read.csv(file="sub/sub_x_round_x_player.csv", head=TRUE, sep=",")



plot.ts(subPlayers,type='o',xy.lines=FALSE, plot.type="single")

x = summary(subPlayers)
x

y = table(subPlayers$P_02)
y



barplot(x, beside = TRUE, col = colors, legend = rownames(subPlayers), ylim = c(0,10))


c = tapply(subPlayers, c('A','B','C'), table)

hist(x)

spineplot(x)

lines(c(, y = NULL, type = "h", lwd = 2, ...)

mean(subPlayers)

      
#tsubPlayers = table(subPlayers)
#tsubPlayers


plot(summary(subPlayers))

# x round
subRounds <- read.csv(file="sub/sub_x_round.csv", head=TRUE, sep=",")

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


# player with the previous submission      
diffFacesPlayers <- read.csv(file="diff/global/diff_faces_x_round_x_player_self.csv", head=TRUE, sep=",")


      
summary(diffFacesPlayers)
jpeg('diff/global/img/diff_faces_x_round_x_player_self.jpg', quality=100, width=600)      
boxplot(diffFacesPlayers, main="Distributions of difference between two subsequent submissions")
dev.off()

      

# mean x round
avgRoundFaceDiffPrevious = rowMeans(diffFacesPlayers, na.rm = FALSE, dims = 1)
plot.ts(avgRoundFaceDiffPrevious, type='o', main="Average face difference per round", ylab="Normalized (0-1) face difference")


plot.ts(diffFacesPlayers, type='o', ylim=rep(c(0,200),9))

plot.ts(diffFacesPlayers, type='o', ylim = c(0,0.6), plot.type="single",  col = colors)
legend(0.5,0.6, colnames(diffFacesPlayers), col = colors, lty = rep(1,9), lwd = rep (2,9), ncol = 3)



# player with the average submission of the round
avgDiffFacesPlayers <- read.csv(file="diff_faces_x_round_x_player_mean.csv", head=TRUE, sep=",")
summary(avgDiffFacesPlayers)
boxplot(avgDiffFacesPlayers)

# mean x round
avgRoundFaceDiff = rowMeans(avgDiffFacesPlayers, na.rm = FALSE, dims = 1)
plot.ts(avgRoundFaceDiff, type='o', main="Average face difference per round", ylab="Normalized (0-1) face difference")
      
plot.ts(avgDiffFacesPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(avgDiffFacesPlayers, type='o', col = colors, ylim=range(avgDiffFacesPlayers), plot.type="single")
legend(0.5,0.5, colnames(diffFacesPlayers), col = colors, lty = rep(1,9), lwd = rep (2,9), ncol = 3)


# Features grouped in parts
plotDiffFeaturesDir("./diff/global/") 
      
# Features grouped in parts
plotDiffFeaturesDir("./diff/parts/")
       
# All single features
plotDiffFeaturesDir("./diff/single/")
      
      


# COPIES


#plotDiffFeaturesDir("./copy/")
      
copies <- read.csv(file="copy/copy_x_round_x_player.csv", head=TRUE, sep=",")
realCopies = copies      
realCopies[realCopies == 0] = NA

jpeg('copy/img/ts_copy_multiple.jpg', quality=100, width=600) 
plot.ts(copies, type='o',ylim=c(0,30),  ylab="The copied face is from N round ago", xlab="Round", main="How old are the copied faces by each player?")
dev.off()

jpeg('copy/img/ts_copy_single.jpg', quality=100, width=600)       
plot.ts(copies, type='o',ylim=c(0,30), plot.type="single", ylab="The copied face is from N round ago", xlab="Round", col = colors, main="How old are the copied faces by each player?")
legend(0.5,30, colnames(copies), col = colors, lty = rep(1,9), lwd = rep (2,9), ncol = 3)
dev.off()
      
# biased      
# boxplot(copies)
      
jpeg('copy/img/boxplot_copy.jpg', quality=100, width=600)  
boxplot(realCopies, main="How old are the copied faces by each player?", ylab="The copied face is from N round ago", xlab="Player")
dev.off()

copies <- read.csv(file="copy/copy_diffs.csv", head=TRUE, sep=",")
copies


jpeg('copy/img/diffs_distr.jpg', quality=100, width=600)  
hist(x=copies$DIFFS, breaks=10, xlab="Normalized difference between copied faces", main="Distribution of normalized differences between copied faces" )
d <- density(copies$DIFFS, from=0) # returns the density data
lines(d) # plots the results
dev.off()      
      
