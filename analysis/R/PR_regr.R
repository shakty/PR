# Working Dir
rm(list=ls())

library(car)

############################
pr.setwd(datadir, 'com_sel');

winlose <- read.csv(file="./win_lose/win_lose_all.csv", head=TRUE, sep=",")
head(winlose, n=10)

winlose.clean <-  na.omit(winlose)
head(winlose.clean, n=10)

fit <- lm(formula = diffSelf ~ published, data = winlose.clean)
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
