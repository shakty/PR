# Working Dir
rm(list=ls())

library(ggplot2)

pr.setwd <- function(DIR, session){
  DATADIR = sprintf("%s%s/csv/", DIR, session)
  setwd(DATADIR)
  getwd()
}

datadir <- '/home/stefano/PR3/analysis/data/'

#session <- 'com_sel'
#session <- 'coo_rnd_orig'
session <- 'com_rnd_fake'
session <- 'coo_sel_err'

sessions.com <- c('com_sel','com_rnd_fake')
sessions.coo <- c('coo_rnd_orig', 'coo_sel_err')

# combined sessions
session <- 'coo'
session <- 'com'

pr.setwd(datadir, session)


library("RColorBrewer")
library('zoo')

par(font=4)

# Player colors
colors = c("lightgreen", "green", "darkgreen", "indianred", "red", "darkred", "lightblue", "blue", "darkblue")
exhs.names = c("A", "B", "C")
exhs.colors = c("green", "red", "darkblue")


# Read from file and:
# 1. Plot Boxplots x player x all rounds
# 2. Plot TS x player x round in separate charts
# 3. Plot TS x player x round in the same chart
# 4. Plot TS mean diff per round
plotDiffFeatures <- function(dir, file) {
  fileName = sprintf("./%s/%s", dir, file)
  diffs <- read.csv(file=fileName, head=TRUE, sep=",")
  summary(diffs)
  # Boxplot
  imgName = sprintf("%s/img/%s%s", dir, file, "_boxplot.jpg")
  jpeg(imgName, quality=100, width=600)
  boxplot(diffs, main=file)
  dev.off()

  # TS

  #separate
  imgName = sprintf("%s/img/%s%s", dir, file, "_ts_multiple.jpg")
  jpeg(imgName, quality=100, width=600)
  plot.ts(diffs, type='o', main=file, ylim=c(0,1))
  dev.off()
  
  #together
  imgName = sprintf("%s/img/%s%s", dir, file, "_ts_single.jpg")
  jpeg(imgName, quality=100, width=600)
  plot.ts(diffs, type='o', ylim=c(0,1), plot.type="single", main=file, col=colors)
  legend(0.5,1, colnames(diffs), col = colors, lty = rep(1,9), lwd = rep (2,9), ncol = 3)
  dev.off()

  #mean diff x round
  meanDiffRound = rowMeans(diffs, na.rm = FALSE, dims = 1)
  imgName = sprintf("%s/img/%s%s", dir, file, "_ts_single_mean_x_round.jpg")
  jpeg(imgName, quality=100, width=600)
  mainName = sprintf("%s mean per round", file)
  plot.ts(meanDiffRound, type='o', ylim=c(0,1), plot.type="single",  main=mainName) 
  dev.off()  
}


plotDiffFeaturesDir <- function(dir) {
  files = list.files(dir)
  for (f in files) {
    if (f != "img") {
      plotDiffFeatures(dir, f)
    }
  }
}

plotEvaSameVsOtherEx <- function(ing, outg, name) {
   outfile <- sprintf("ingroup/img/%s.jpg", name)
   jpeg(outfile, quality=100, width=600)
   old = par(oma = c(3,0,0,0))

   plot(density(ing$score),
     xlim=c(0,10),
     ylim=c(0,0.2),
     lty=1,
     col="2",
     main="Review scores for paintings in same exhibition vs other exhibition")
   lines(density(outg$score),
      xlim=c(0,10),
      lty=2)
   grid(col="gray", nx=NA, ny=NULL)
   legend("top",
       legend=c("Same", "Other"),
       ncol=2,
       lty=1:2,
       col=c("2","1"))
   
   mtext(name, side = 1, outer=FALSE, padj=8)
   par(old)
   dev.off()
}

boxplotEvaSameVsOtherEx <- function(ing, outg, name) {
     outfile <- sprintf("ingroup/img/%s.jpg", name)
     jpeg(outfile, quality=100, width=600)
     boxplot(ing$score, outg$score,
        main="Review scores for paintings in same exhibition vs other exhibition")
     grid(col="gray", nx=NA, ny=NULL)
     axis(1, at=1:2, labels=c("Same", "Other"))
     dev.off()
}


read.tables <- function(files, ...) {
  df <- data.frame(Date=as.Date(character()),
                 File=character(), 
                 User=character(), 
                 stringsAsFactors=FALSE)
  #df <- list()
  for (f in files) {
      csv <- read.csv(file=f, head=TRUE, sep=",")
      head(csv)
      csv$file <- f
      df <- rbind(df, csv)
  }

  return(df)
}

createFileList <- function(file, DIR, sessions) {
  files <- list()
  for (s in sessions) {
    myFile <- sprintf("%s%s/csv/%s", DIR, s, file)
    files <- c(files, myFile)
  }

  return(files)
}

getCSVPath <- function(DIR, session) {
  return(sprintf("%s%s/csv/", DIR, session))
}

getFilePath <- function(DIR, session, file) {
  return(sprintf("%s%s/csv/%s", DIR, session, file))
}
