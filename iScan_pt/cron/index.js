//每天产生一次分析数据
require('./taggerToAnalysis').job.start();
//每30秒产生一条分析数据
require('./taggerToTrack').job.start();

//清除5天前的数据
require('./clearTagger5DaysAgo').job.start();
