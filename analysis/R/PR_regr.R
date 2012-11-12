# Working Dir
#rm(list=ls())

library(car)

library(plm)

############################
pr.setwd(datadir, 'com_sel');

winlose <- read.csv(file="./win_lose/win_lose_all.csv", head=TRUE, sep=",")
head(winlose, n=10)

class(winlose$stay)="factor"
class(winlose$published)="factor"

wl <- pdata.frame(winlose, index=c('player','round'))

wl$published.lag <- lag(wl$published, 1)

wl <- na.omit(wl)

plot(density(winlose$stay))

a <- table(wl$stay, wl$published, dnn=cbind("stay","pub"))
plot(a, col=cbind("1","2"))

cor(wl$stay, wl$published.lag)

head(wl)

plot(density(wl$diffOthers),
     col="1",
     ylim=c(0,10))
lines((density(pubBefore.clean$diffOthers)),
      col="2")
lines((density(notPubBefore.clean$diffOthers)),
      col="3")



plot(density(wl$diffSelf),
     col="1",
     ylim=c(0,6))
lines((density(pubBefore.clean$diffSelf)),
      col="2")
lines((density(notPubBefore.clean$diffSelf)),
      col="3")
grid(col="gray", nx=NULL, ny=NULL)
legend("top",
       legend=c("All", "Published before", "Not published before"),
       ncol=2,
       lty=1,
       col=c("1","2","3"))


plot(density(wl$diffPubs),
     col="1",
     ylim=c(0,12))
lines((density(pubBefore.clean$diffPubs)),
      col="2")
lines((density(notPubBefore.clean$diffPubs)),
      col="3")
grid(col="gray", nx=NULL, ny=NULL)
legend("top",
       legend=c("All", "Published before", "Not published before"),
       ncol=2,
       lty=1,
       col=c("1","2","3"))


plot(density(wl$diffPubsCum),
     col="1",
     ylim=c(0,16))
lines((density(pubBefore.clean$diffPubsCum)),
      col="2")
lines((density(notPubBefore.clean$diffPubsCum)),
      col="3")
grid(col="gray", nx=NULL, ny=NULL)
legend("top",
       legend=c("All", "Published before", "Not published before"),
       ncol=2,
       lty=1,
       col=c("1","2","3"))


boxplot(pubBefore.clean$diffSelf, notPubBefore.clean$diffSelf)

summary(pubBefore.clean$diffPubs)
summary(notPubBefore.clean$diffPubs)


t.test(pubBefore.clean$diffPubs, notPubBefore.clean$diffPubs)

summary(t)

mean(pubBefore.clean$diffPubs)

mean(notPubBefore.clean$diffPubs)



pubBefore <- winlose[winlose$published == 1,]
pubBefore.clean <- na.omit(pubBefore)

head(pubBefore.clean)

notPubBefore <- winlose[winlose$published == 0,]


notPubBefore.clean <- na.omit(notPubBefore)

head(notPubBefore.clean)


h <- hist(wl$diffOthers)


     
table(wl$published.lag, w)

summary(s)

#plot(winlose$diffOthers, winlose$published)

wl2 <- as.data.frame(wl)

fit <- glm(stay ~ published.lag, data=wl2, family="binomial")

fit <- lm(stay ~ published.lag, data=wl2)

summary(fit)

winlose.clean <-  na.omit(winlose)
head(winlose.clean, n=10)

fit <- lm(formula = diffSelf ~ published.lag + , data = wl2)

summary(fit)

fit.res <- resid(fit)
plot(winlose.clean$diffSelf, fit.res)
abline(0,0)

fit.stders <- rstandard(fit)
plot(winlose.clean$diffSelf, fit.stders)
abline(0,0)

qqnorm(fit.stders)
qqline(fit.stders)


par(mfrow=c(2,2))
plot(fit)


# Outliers

outlierTest(fit) # Bonferonni p-value for most extreme obs


qqPlot(fit, main="QQ Plot") #qq plot for studentized resid
leveragePlots(fit) # leverage

# Influential Observations
# added variable plots
av.Plots(fit)
# Cook's D plot
# identify D values > 4/(n-k-1)
cutoff <- 4/((nrow(mtcars)-length(fit$coefficients)-2))
plot(fit, which=4, cook.levels=cutoff)
# Influence Plot
influencePlot(fit, id.method="identify", main="Influence Plot", sub="Circle size is proportial to Cook's Distance" )


# Normality of Residuals
# qq plot for studentized resid
qqPlot(fit, main="QQ Plot")
# distribution of studentized residuals
library(MASS)
sresid <- studres(fit)
hist(sresid, freq=FALSE,
   main="Distribution of Studentized Residuals")
xfit<-seq(min(sresid),max(sresid),length=40)
yfit<-dnorm(xfit)
lines(xfit, yfit) 


# Evaluate homoscedasticity
# non-constant error variance test
ncvTest(fit)
# plot studentized residuals vs. fitted values
spreadLevelPlot(fit)


# Evaluate Collinearity
vif(fit) # variance inflation factors
sqrt(vif(fit)) > 2 # problem?


# Evaluate Nonlinearity
# component + residual plot
crPlots(fit)
# Ceres plots
ceresPlots(fit)


# Test for Autocorrelated Errors
durbinWatsonTest(fit)

winlose.players <- read.csv(file="./win_lose/win_lose_by_player.csv", head=TRUE, sep=",")
head(winlose.players, n=10)



fit <- lm(formula = P_04_stay ~ P_04_published, data = winlose.players)
summary(fit)
