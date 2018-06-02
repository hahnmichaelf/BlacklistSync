# BlacklistSync

#### Syncs blacklists from https://github.com/MetaMask/eth-phishing-detect, https://github.com/409h/etheraddresslookup, and https://github.com/mrluit/etherscamdb

_Author: Michael Hahn - blurpesec_

#### Requires:
 - `Node.JS` (built with v8.9.4)
 - `npm` (built with v5.6.0)


 #### Steps to use:

  - Clone this project with: `git clone https://github.com/hahnmichaelf/blacklistsync.git`.

  - Cd to the BlacklistSync Directory with `cd blacklistsync`.

  - Run `node app`

  - The app will grab the data from each blacklist as long as you have internet connection, concatenate it into a master `blacklist.json`, and then test to see which domains are missing from each blacklist, outputting the set to `writeeal.json`, `writeesdb.json`, and `writemm-epd.json`.

  - An webapp will be spun up at http://localhost:3000/ that displays current holdings of each imported blacklist and master blacklist.

  - This process will repeat on a 3 minute loop as specified in `app.js`.


  #### Incomplete Features:

  * Run a check on each write___.json to determine what is picked up by each application/extension's levenshtein-distance checks. Then output still-missing domains to a script that pushes the domains to each open-source blacklist.

  * Batch every 15 minutes to output the full master blacklist to a more-permanant `lists/blacklist.json`.

  _The next may wait until this backend functionality is merged into esdb to make use of the already well-known domain_
  * Expand the front-end application's functionality to have a better reporting process with different tiers of trusted domain submission.
    * Create an API that allows for people to submit domains singularly or in-batch.
    * Create a reporting method that is easily-accessible, and pushes data to a queue where it is sorted based off of levenshtein distances to a whitelist, and other fingerprints.
    * Expand API usage for trusted 3rd parties to submit domains that can bypass queue system for automated sorting.


  * Further automate the process for finding domains. Brainstorm mor eon this.
