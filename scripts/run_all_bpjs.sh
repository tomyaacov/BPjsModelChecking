#!/bin/bash
### sbatch config parameters must start with #SBATCH and must precede any other command. to ignore just add another # - like so ##SBATCH
#SBATCH --partition main ### specify partition name where to run a job
#SBATCH --time 7-00:00:00 ### limit the time of job running. Format: D-H:MM:SS
#SBATCH --job-name run_all_bpjs ### name of the job. replace my_job with your desired job name
#SBATCH --output run_all_bpjs.out ### output log for running job - %J is the job number variable
#SBATCH --mail-user=tomya@post.bgu.ac.il ### users email for sending job status notifications ñ replace with yours
#SBATCH --mail-type=BEGIN,END,FAIL ### conditions when to send the email. ALL,BEGIN,END,FAIL, REQUEU, NONE
#SBATCH --mem=16G ### total amount of RAM // 500
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=32 ##. // max 128

### Start you code below ####
module load anaconda ### load anaconda module
source activate bppy_model_checking ### activating Conda environment. Environment must be configured before running the job
cd ~/repos/BPjsModelChecking/ || exit
export MAVEN_OPTS="-Xms1024k -Xmx4g"
mvn compile > /dev/null 2>&1
options=(
"hot_cold 30 1 false" "hot_cold 60 1 false" "hot_cold 90 1 false"
"hot_cold 30 2 false" "hot_cold 60 2 false" "hot_cold 90 2 false"
"hot_cold 30 3 false" "hot_cold 60 3 false" "hot_cold 90 3 false"
"hot_cold 30 1 true" "hot_cold 60 1 true" "hot_cold 90 1 true"
"hot_cold 30 2 true" "hot_cold 60 2 true" "hot_cold 90 2 true"
"hot_cold 30 3 true" "hot_cold 60 3 true" "hot_cold 90 3 true"

"dining_philosophers 2 false" "dining_philosophers 3 false" "dining_philosophers 4 false" "dining_philosophers 5 false"
"dining_philosophers 2 true" "dining_philosophers 3 true" "dining_philosophers 4 true" "dining_philosophers 5 true"

)
for option in "${options[@]}"; do
  echo "$option"
  timeout 30m /usr/bin/time -v mvn exec:java -D"exec.args"="$option"
done
