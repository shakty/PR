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


# player with the previous submission      
diffFacesPlayers <- read.csv(file="diff_faces_x_round_x_player_self.csv", head=TRUE, sep=",")
summary(diffFacesPlayers)
boxplot(diffFacesPlayers)
      

plot.ts(diffFacesPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(diffFacesPlayers, type='o', ylim=range(diffFacesPlayers), plot.type="single")


# player with the average submission of the round
avgDiffFacesPlayers <- read.csv(file="diff_faces_x_round_x_player_mean.csv", head=TRUE, sep=",")
summary(avgDiffFacesPlayers)
boxplot(avgDiffFacesPlayers)
      

plot.ts(avgDiffFacesPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(avgDiffFacesPlayers, type='o', ylim=range(avgDiffFacesPlayers), plot.type="single")  


# Specific parts: head

avgDiffHeadPlayers <- read.csv(file="diff_head_x_round_x_player_mean.csv", head=TRUE, sep=",")
summary(avgDiffHeadPlayers)
boxplot(avgDiffHeadPlayers)
      

plot.ts(avgDiffHeadPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(avgDiffHeadPlayers, type='o', ylim=range(avgDiffHeadPlayers), plot.type="single") 


# Specific parts: eyes

avgDiffEyesPlayers <- read.csv(file="diff_eyes_x_round_x_player_mean.csv", head=TRUE, sep=",")
summary(avgDiffEyesPlayers)
boxplot(avgDiffEyesPlayers)
      

plot.ts(avgDiffEyesPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(avgDiffEyesPlayers, type='o', ylim=range(avgDiffEyesPlayers), plot.type="single")


# Specific parts: eyebrows

avgDiffEyebrowsPlayers <- read.csv(file="diff_eyebrows_x_round_x_player_mean.csv", head=TRUE, sep=",")
summary(avgDiffEyebrowsPlayers)
boxplot(avgDiffEyebrowsPlayers)
      

plot.ts(avgDiffEyebrowsPlayers, type='o',ylim=c(0,1))

plot.ts(avgDiffEyebrowsPlayers, type='o', ylim=range(avgDiffEyebrowsPlayers), plot.type="single")

      
# Specific parts: mouth

avgDiffMouthsPlayers <- read.csv(file="diff_mouth_x_round_x_player_mean.csv", head=TRUE, sep=",")
summary(avgDiffMouthsPlayers)
boxplot(avgDiffMouthsPlayers)
      

plot.ts(avgDiffMouthsPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(avgDiffMouthsPlayers, type='o', ylim=range(avgDiffMouthsPlayers), plot.type="single")        


# Specific parts: zoom

avgDiffZoomPlayers <- read.csv(file="diff_zoom_x_round_x_player_mean.csv", head=TRUE, sep=",")
summary(avgDiffZoomPlayers)
boxplot(avgDiffZoomPlayers)
      

plot.ts(avgDiffZoomPlayers, type='o',ylim=rep(c(0,200),4))

plot.ts(avgDiffZoomPlayers, type='o', ylim=range(avgDiffZoomPlayers), plot.type="single", legend=TRUE) 


      

legend(2000,9.5, # places a legend at the appropriate place
       c("Health","Defense"), # puts text in the legend
       lty=c(1,1), # gives the legend appropriate symbols (lines)
       lwd=c(2.5,2.5), col=c("blue","red")) # gives the legend lines the correct color and width      


# All single features




plotDiffFeatures <- function(file) {
  fileName = sprintf("./single/%s", file)
  diffs <- read.csv(file=fileName, head=TRUE, sep=",")
  summary(diffs)

  # Boxplot
  imgName = sprintf("%s%s%s", "./single/img/", file, "_boxplot.jpg")
  jpeg(imgName, quality=100, width=600)
  boxplot(diffs, main=file)
  dev.off()

  # TS

  #separate
  imgName = sprintf("%s%s%s", "./single/img/", file, "_ts_multiple.jpg")
  jpeg(imgName, quality=100, width=600)
  plot.ts(diffs, type='o', main=file, legend=TRUE, ylim=c(0,1))
  dev.off()
  
  #together
  imgName = sprintf("%s%s%s", "./single/img/", file, "_ts_single.jpg")
  jpeg(imgName, quality=100, width=600)
  plot.ts(diffs, type='o', ylim=c(0,1), plot.type="single", legend=TRUE, main=file) 
  dev.off()
  
}

singleFeatures = list.files("./single/")

for (f in singleFeatures) {
  plotDiffFeatures(f)
}
      
