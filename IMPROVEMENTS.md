# Improvements

**Author:** Abiral Shakya
**Role:** Senior Software Engineer
**Time taken:** <Let us know how many hours and minutes you spent on this task, including writing your improvements>

<Write about your suggested improvements here. Remember, software engineering is about communicating with people more than it is about writing instructions for machines>
1. Account for quantity of each item while calculating the quote
2. The e2e tests are dependent on each other and needs to run in sequence. That should be changed to make each test run independantly 
3. route `/healthz`, if being used as a healthcheck endpoint, is querying for all orders. Not only it is an overkill but having a health-checks depend on a backend dependency can be problematic as an outage can trigger the system to be unstable.
4. 
