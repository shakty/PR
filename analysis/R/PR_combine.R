#coo

# 'ingroup/all_reviews.csv'
mergeDatasets <- function(file, DIR, sessions, out.dir) {
  
  files <- createFileList(file, datadir, sessions)
  files

  data <- read.tables(files)
  
  out <- sprintf("%s%s/csv/%s", DIR, out.dir, file)
  
  write.csv(data, out)
}


mergeDatasets('ingroup/all_reviews.csv', datadir, sessions.coo, 'coo')

mergeDatasets('ingroup/all_reviews.csv', datadir, sessions.com, 'com')


getCommonDatasets <- function(DIR, sessions) {
  for (s in sessions) {
    myFile <- sprint("%s%s/csv/", DIR, s)
    files <- c(files, myFile)
  }

}

mergeAllDatasets <- function(DIR, sessions, out.dir) {
  
  files <- createFileList(file, datadir, sessions.coo)
  files
}

filenames <- list.files(getFilePath(datadir, 'com_sel', 'ingroup'), pattern="*.csv", full.names=TRUE)
filename
ldf <- lapply(filenames, read.csv)



res <- lapply(ldf, summary)
names(res) <- substr(filenames, 6, 30)

filenames <- list.files("temp", pattern="*.csv")
paste("temp", filenames, sep="/")
