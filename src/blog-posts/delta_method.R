library(data.table)
library(lubridate)
library(ggplot2)
library(gridExtra)

# Load data ====================================================================
# https://finance.yahoo.com/quote/TSLA/history
dt = fread("https://query1.finance.yahoo.com/v7/finance/download/TSLA?period1=1321444326&period2=1610832766&interval=1d&events=history")
dt[, lClose := log(Close)]

# Show why log transformation is useful ========================================
lm_1 = lm(Close ~ Date, data=dt)
lm_2 = lm(lClose ~ Date, data=dt)
r2_1 = summary(lm_1)$r.squared
r2_2 = summary(lm_2)$r.squared

theme_blog = theme_bw() +
theme(
  panel.grid.major = element_blank(),
  panel.grid.minor = element_blank(),
  panel.border = element_blank(), # This and the next line: left and bottom border
  axis.line.x = element_line(),
  axis.title.x = element_blank(),
  axis.title.y = element_blank(),
  axis.text.y=element_blank(),
  axis.ticks.y=element_blank(),
  legend.position = c(0.2, 0.8)
)
g1 = ggplot(dt, aes(x=Date, y=Close)) +
  geom_line() +
  geom_smooth(data=dt, formula="y~x", method="lm", col="red", se=FALSE, fullrange=TRUE) +
  theme_blog +
  annotate("text", x = dt$Date[200], y = 700, label = paste0("R2=",round(r2_1,3)), size=8)
g2 = ggplot(dt, aes(x=Date, y=lClose)) +
  geom_line() + geom_smooth(data=dt, formula="y~x", method="lm", col="red", se=FALSE, fullrange=TRUE) + 
  theme_blog +
  annotate("text", x = dt$Date[200], y = log(500), label = paste0("R2=",round(r2_2,3)), size=8)
ggsave(file.path(.github,
                 "harveybarnhard.github.io/public/img/blog",
                 "delta-method/tsla.svg"),
       plot = g1,
       device ="svg",
       width = 13/1.1, height=4/1.1, units="in")
ggsave(file.path(.github,
                 "harveybarnhard.github.io/public/img/blog",
                 "delta-method/log-tsla.svg"),
       plot = g2,
       device ="svg",
       width = 13/1.1, height=4/1.1, units="in")

# Predict Price ================================================================
dt_new = data.table(
  Date = seq(ymd('2020-01-17'),ymd('2030-01-16'),by='days')
)
predictions = predict(lm_2, newdata=dt_new, interval="prediction")
predictions = data.table(predictions)
fit_dollars_lin = predict(lm_1, newdata=dt_new)
dt_new = cbind(dt_new, predictions, fit_dollars_lin)
g3 = ggplot() +
  geom_line(data=dt, mapping=aes(x=Date, y=lClose)) +
  geom_line(data=dt_new, mapping=aes(x=Date, y=fit), linetype = "dashed") +
  geom_ribbon(data=dt_new, mapping=aes(x=Date, ymin=lwr, ymax=upr),
              alpha=0.2) +
  theme_blog
ggsave(file.path(.github,
                 "harveybarnhard.github.io/public/img/blog",
                 "delta-method/log-tsla-predict.svg"),
       plot = g3,
       device ="svg",
       width = 13/1.1, height=4/1.1, units="in")


# Transform standard errors ====================================================
# Calculate standard error of prediction
dt_new[, std_err := (upr-lwr)/(2*1.96)]
dt_new[, fit_dollars := exp(fit)]

# Naive method
dt_new[, std_err_naive := (exp(fit+std_err) - exp(fit-std_err))/2]
dt_new[, lwr_naive := fit_dollars - 1.96*std_err_naive]
dt_new[, upr_naive := fit_dollars + 1.96*std_err_naive]

# Delta method
dt_new[, std_err_delta := exp(fit)*std_err]
dt_new[, lwr_delta := fit_dollars - 1.96*std_err_delta]
dt_new[, upr_delta := fit_dollars + 1.96*std_err_delta]

# Calculate annual growth rate =================================================
date_present = ymd('2020-01-15')
date_future  = ymd('2030-01-15')
present = dt[Date==date_present]$Close
future = dt_new[Date==date_future]$fit_dollars
growth = (future/present)^(1/9) - 1

future_naive = dt_new[Date==date_future]$std_err_naive
future_delta = dt_new[Date==date_future]$std_err_delta

# Create plot comparing methods ================================================


g4 = ggplot() +
  geom_line(data=dt, mapping=aes(x=Date, y=Close)) +
  geom_line(data=dt_new, mapping=aes(x=Date, y=fit_dollars), linetype = "dashed") +
  geom_ribbon(data=dt_new, mapping=aes(x=Date, ymin=lwr_naive, ymax=upr_naive, color=paste0("Naive Method: $", round(future)," ($", round(future_naive), ")")),
              alpha=0.2) +
  geom_ribbon(data=dt_new, mapping=aes(x=Date, ymin=lwr_delta, ymax=upr_delta, color=paste0("Delta Method: $", round(future)," ($", round(future_delta), ")")),
              alpha=0.2) +
  theme_blog +
  xlim(c(ymd('2019-01-17'), ymd('2030-01-17'))) +
  scale_colour_manual("Prediction and Standard Error on January 15, 2030", values=c("blue", "red"))
ggsave(file.path(.github,
                 "harveybarnhard.github.io/public/img/blog",
                 "delta-method/tsla-predict.svg"),
       plot = g4,
       device ="svg",
       width = 13/1.1, height=6/1.1, units="in")
