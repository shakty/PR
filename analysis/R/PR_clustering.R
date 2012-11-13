# Working Dir
#rm(list=ls())

library(car)

library(plm)

library(e1071)

############################
pr.setwd(datadir, 'com_sel');

p2p <- read.csv(file="diff/global/p2p.csv", head=TRUE, sep=",")
head(p2p, n=10)

a <- p2p[p2p$round == 1,]

a <- a[c(-1,-2)]


dist(p2p)

hclust(a)

hc <- hclust(dist(as.matrix(a)))
plot(hc)

for (i in 1:30) {
  clusterIt(i)
}

b <- as.matrix(p2p); b

clusterIt <- function(round){
  a <- p2p[p2p$round == round,]
  a <- a[c(-1,-2)]
  d <- dist(as.matrix(a))
  l <- rep(c(2:10),30)
  hc <- hclust(d)
  main <- sprintf('Round: %i', round)
  outfile <- sprintf('diff/global/img/p2p_c_%i.jpeg', round)
  jpeg(outfile, quality=100, width=600)
  plot(hc, main=main, labels=c(2:10))
  dev.off()
}


r <- cmeans(a, 3, 100, m=2, method="cmeans")

plot(r)


result <- cmeans(iris[,-5], 3, 100, m=2, method="cmeans")

plot(iris[,1], iris[,2], col=result$cluster)


points(result$centers[,c(1,2)], col=1:3, pch=8, cex=2)
result$membership[1:3,]
