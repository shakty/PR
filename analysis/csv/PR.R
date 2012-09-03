# Init
source('PR_init.R')

## Publications
###############

subPlayers <- read.csv(file="pubs/pubs_x_round_x_player.csv", head=TRUE, sep=",")
subPlayers.count <- apply(subPlayers, 2, sum)
subPlayers.count


jpeg('pubs/img/pubs_count_by_player.jpg',quality=100,width=600)
x <- barplot(subPlayers.count,
        col = colors,
        ylim=c(0,30),
        main='Number of publications by player')
y <- as.matrix(subPlayers.count)
text(x,y+0.5, labels=as.character(y))
dev.off()

## Evaluations
##############

# Load file

players <- read.csv(file="eva/eva_x_player.csv", head=TRUE, sep=",")
summary(players)
boxplot(players)

#players.ohne3 <- players[, !names(players) %in% c('P_03')]
#summary(players.ohne3)

# Mean review all players
#colMeans(cbind(colMeans(players.ohne3)))
# Mean review all players but P_03
#colMeans(cbind(colMeans(players)))


jpeg('eva/img/players_boxplot.jpg',quality=100,width=600)
boxplot(players,main="Distribution of evaluation scores per player")
dev.off()

# Time Series
jpeg('eva/img/players_eva_ts.jpg',quality=100,width=600)
plot.ts(players, type='o',ylim=c(0,10))
dev.off()
#Mean = mean(mean(players))
#Mean
#abline(h=Mean)

# ROUNDS
rounds <- read.csv(file="eva/eva_x_round.csv", head=TRUE, sep=",")
summary(rounds)
jpeg('eva/img/round_evas_boxplot.jpg',quality=100,width=600)
boxplot(rounds, main="Distribution of evaluation scores per round",ylab="Evaluation score")
dev.off()

meanRounds = apply(rounds, MARGIN=2, mean)
meanRounds

#jpeg('img/round_evas_mean.jpg',quality=100,width=600)
plot(meanRounds, main="Evaluation mean per round",ylab="Evaluation score",ylim=c(0,10))
lines(meanRounds)
abline(lm(meanRounds ~ c(1:30)))
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
subPlayers <- read.table(file="sub/sub_x_round_x_player.csv", head=TRUE, sep=",")
subPlayers

jpeg('sub/img/players_sub_ts.jpg',quality=100,width=600)
plot.ts(subPlayers,type='o', plot.type="multiple", main='Exhibition choice over 30 rounds')
dev.off()

# If we load the _int version we can produce this graph
#subPlayers.int <- read.table(file="sub/sub_x_round_x_player_int.csv", head=TRUE, sep=",")
#subPlayers.int
#subPlayers.int.jitter = apply(subPlayers.int, 2, jitter, amount=0.05)
#plot.ts(subPlayers.int.jitter, type='p', plot.type="single")

playerSubs <- apply(subPlayers, 2, table)
playerSubs

#oldpar = par(mar=c(5,4,4,8), xpd=T)
#par(oldpar)

jpeg('sub/img/player_subs_all.jpg',quality=100,width=600)
barplot(playerSubs,
        col = brewer.pal(3,"Set1"),
        border="white",
        ylim=c(0,35),
        main='Players submissions by exhibition',
        legend.text = c('A','B','C'),
        args.legend = list(bty="n", horiz=TRUE, x="top"))
dev.off()

# x round (not working well)
#subRounds <- read.csv(file="sub/sub_x_round.csv", head=TRUE, sep=",")

#subRounds.tableF <- apply(subRounds, 2, factor, lev=exhs.names); subRounds.tableF
#subRounds.table <- apply(subRounds.tableF, 2, table); subRounds.table
      
#barplot(do.call(cbind,subRounds.table),
#        col = brewer.pal(3,"Set1"),
#        border="white",
#        legend.text = exhs.names,
#        args.legend = list(bty="n", horiz=TRUE, x="top"))
      
#subRounds.table <- apply(subRounds, 2, table, dnn=c('A','B','C'), row.names=c('A','B','C'))
#subRounds.table

#plot.ts(subRounds.table, type='p', plot.type="single")
      
# x ex round_count (not found!)
#subExRounds.count <- read.csv(file="sub/sub_x_ex_round_count.csv", head=TRUE, sep=",")

#old = par(mai=c(1,1,1,1))

#jpeg('sub/img/exhibs_count_ts.jpg',quality=100,width=600)
#barplot(as.matrix(subExRounds.count),
#        col = brewer.pal(3,"Set1"),
#        border="white",
#        ylim=c(0,10),
#        main='Submission by exhibition per round',
#        legend.text = exhs.names,
#        args.legend = list(bty="n", horiz=TRUE, x="top"))
#dev.off()

#par(old)

# x ex
subExRound <- read.csv(file="sub/sub_x_ex_round.csv", head=TRUE, sep=","); subExRound
summary(subExRound)

subExRound.t <- t(subExRound); subExRound.t

jpeg('sub/img/exhibs_count_ts.jpg',quality=100,width=600)
barplot(as.matrix(subExRound.t),
        col = brewer.pal(3,"Set1"),
        border="white",
        ylim=c(0,10),
        main='Submission by exhibition per round',
        legend.text = exhs.names,
        args.legend = list(bty="n", horiz=TRUE, x="top"))
dev.off()

#plot.ts(subExRound, type='o', plot.type="single", col=exhs.colors)
#legend("top", legend=exhs.names, col = exhs.colors, lty = rep(1,9), lwd = rep (2,9), ncol = 3)

      
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
avgDiffFacesPlayers <- read.csv(file="diff/global/diff_faces_x_round_x_player_mean.csv", head=TRUE, sep=",")
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
       
# All single feature
plotDiffFeaturesDir("./diff/single/")
            
# All players vs self
plotDiffFeaturesDir("./diff/self/")      

# All players vs published
plotDiffFeaturesDir("./diff/pubs/")        

# All players vs published in previous round
plotDiffFeaturesDir("./diff/previouspub/")        


# COPIES
########

#plotDiffFeaturesDir("./copy/")

copies.normalized <- read.csv(file="copy/copy_x_round_x_player_norm.csv", head=TRUE, sep=",")


jpeg('copy/img/ts_copy_multiple_normalized.jpg', quality=100, width=600)
plot(zoo(copies.normalized),
     ylim=c(0,1),
     main="How old are the copied faces by each player? (normalized)",
     xlab='Rounds')

dev.off()         


copies.normalized[copies.normalized == 0] = NA
old = par(yaxs="i", las="1")
jpeg('copy/img/distr_copy_normalized.jpg', quality=100, width=600)
hist(as.matrix(copies.normalized),
     breaks=20,
     main='Distribution: How many rounds away is the original (normalized)',
     col="black", border="white",
     ylim=c(0,70),
     xlab="Normalized distance in round (max=1)")
box(bty="l")
grid(nx=NA, ny=NULL, lty=1, lwd=1, col="gray")
dev.off()
par(old)


copies <- read.csv(file="copy/copy_x_round_x_player.csv", head=TRUE, sep=",")
realCopies = copies      
realCopies[realCopies == 0] = NA

jpeg('copy/img/ts_copy_multiple.jpg', quality=100, width=600) 
plot.ts(copies, type='o',ylim=c(0,30),  ylab="The copied face is from N round ago", xlab="Round", main="How old are the copied faces by each player?")
dev.off()

jpeg('copy/img/ts_copy_single.jpg', quality=100, width=600)
plot.ts(copies, type='o',ylim=c(0,30), plot.type="single", ylab="The copied face is from N round ago", xlab="Round", col = colors, main="How old are the copied faces by each player?")
legend(0.5,30, colnames(copies), col = colors, lty = rep(1,9), lwd = rep (2,9), ncol = 3)
abline(a=0,b=1)
dev.off()
      
# biased      
# boxplot(copies)
      
jpeg('copy/img/boxplot_copy.jpg', quality=100, width=600)  
boxplot(realCopies, main="How old are the copied faces by each player?", ylab="The copied face is from N round ago", xlab="Player")
dev.off()

copies <- read.csv(file="copy/copy_diffs.csv", head=TRUE, sep=",")

jpeg('copy/img/diffs_distr.jpg', quality=100, width=600)
hist(x=copies$DIFFS, breaks=10, xlab="Normalized difference between copied faces", main="Distribution of normalized differences between copied faces" )
#d <- density(copies$DIFFS, from=0, kernel="epanechnikov") # returns the density data
#lines(d, col="red", lwd=4) # plots the results
grid(nx=NA, ny=NULL, lty=1,lwd=1, col="gray")
dev.off()      

# DIFF and SCORE

df <- read.csv(file="diff/diffandscore/diffandscore.csv", head=TRUE, sep=",")

jpeg('diff/diffandscore/img/diffandscore.jpg', quality=100, width=600)
plot(df$D ~ df$S, main='Face distance from pub. faces in the previous round vs score', ylab='Distance from published faces in the previous round', xlab='Review score')
abline(v=5, col='red',lwd=2)
abline(v=7, col='orange', lwd=1)
dev.off()


df.copy <- read.csv(file="diff/diffandscore/diffandscore_copy.csv", head=TRUE, sep=",")

jpeg('diff/diffandscore/img/diffandscore_copy.jpg', quality=100, width=600)
plot(df.copy$D ~ df.copy$S, main='Face distance from pub. faces in the previous round vs score (just copies)', ylab='Distance from published faces in the previous round', xlab='Review score')
abline(v=5, col='red',lwd=2)
abline(v=7, col='orange', lwd=1)
dev.off()

df.copyoriginal <- read.csv(file="diff/diffandscore/copy_from_original_andscore.csv", head=TRUE, sep=",")

jpeg('diff/diffandscore/img/copy_from_original_andscore.jpg', quality=100, width=600)
plot(df.copyoriginal$D ~ df.copyoriginal$S, main='Face distance from original faces vs score', ylab='Distance from published faces in the previous round', xlab='Review score')
abline(v=5, col='red',lwd=2)
abline(v=7, col='orange', lwd=1)
dev.off()

# InGroup
#########

ingroup <- read.csv(file="ingroup/all_reviews.csv", head=TRUE, sep=",")
head(ingroup)


# boxplot(ingroup$score ~ ingroup$same)

plotSingleInOutTS <- function(name){
  fileName = sprintf("./ingroup/img/%s.jpg", name)
}

#for (i in names(

ingroup.same <- ingroup[ingroup$same == 1,]
ingroup.same


ingroup.other <- ingroup[ingroup$same != 1,]
ingroup.other


stats.in = summary(ingroup.same$score)
stats.out = summary(ingroup.other$score)

# are mean different?
t = t.test(ingroup.same$score, ingroup.other$score)

n = length(ingroup.same$score)
sigma = sd(ingroup.same$score) / sqrt(n)
meanIn = as.numeric(stats.in["Mean"])
meanOut = as.numeric(stats.out["Mean"])
diffMeans = meanIn - meanOut
test = diffMeans / sigma
test


alpha = .05
t.half.alpha = qt(1-alpha/2, df=n-1)
c(-t.half.alpha, t.half.alpha)

R2 = test^2 / (test^2 + n - 1)
R2


# plot.ts(cbind(ingroup=ingroup.same$score, outgroup=ingroup.other$score),
# main='Review scores for in-group and out-group (color)',
# xlab='time')

jpeg('ingroup/img/reviews_in_out_ts.jpg', quality=100, width=600)
old = par(mfrow=c(2,1), oma = c(0,0,3,0))
plot.ts(ingroup.same$score,
        main='In-group',
        xlab='time',
        ylab="score")
plot.ts(ingroup.other$score,
        main='Out-group',
        ylab="score",
        xlab='time')
mtext("Review scores for in-group and out-group (color)", outer = TRUE )
par(old)
dev.off()

jpeg('ingroup/img/reviews_in_out_boxplot.jpg', quality=100, width=600)
old = par(oma = c(3,0,0,0))
boxplot(cbind(ingroup=ingroup.same$score, outgroup=ingroup.other$score),
        main="Distribution of review scores for ingroup and outgroup (color)",
        ylab="Score")
txt = sprintf('In-mean = %f, Out-mean = %f, t(%i) = %f, p < .05', meanIn, meanOut, (n-1), test)
txt = 'Difference is statistically not significant p < .1'
mtext(txt, side = 1, outer=FALSE, padj=5)
par(old)
dev.off()

library(ggplot2)
qplot(score, data=ingroup,col = as.factor(ingroup$same), beside=TRUE)


ingroup.players <- read.csv(file="ingroup/player_reviews.csv", head=TRUE, sep=",")
head(ingroup.players)



names(ingroup.players)


scorecolumns <- regexpr("score", names(ingroup.players)) > 0

ingroup.scores <- ingroup.players[scorecolumns]
ingroup.scores

jpeg('ingroup/img/reviews_players_ts.jpg', quality=100, width=600)
plot(zoo(ingroup.scores),
     ylim=c(0,10),
     main="Evolution of individual review scores in time",
     xlab='Rounds')     
dev.off()


