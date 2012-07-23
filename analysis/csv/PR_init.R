# Working Dir
rm(list=ls())
setwd('/home/stefano/PR/analysis/csv')
#setwd('/home/balistef/PR/analysis/csv')

library("RColorBrewer")

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
    plotDiffFeatures(dir, f)
  }
}

