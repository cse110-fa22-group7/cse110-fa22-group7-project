# CI-CD Pipeline

## The Planned Pipeline:

1. Create a pull request:

2. Lint
    - Eslint for javascript
    - prettier for html/css

3. Documentation Pt2.
    - use JSDocs to use code comments, function headers/class headers to fill out n.

3. Code Quality:
    - HTML5 Validator
    - Codeclimate

4. Testing
    - No automated testing at the moment, will figure this is out throughout week 8 after doing the related lab
    - Possible tools:
        - Jest
        - Cypress

5. Request a Review:
    - request a manual review on the pull request, this will send a slack message and email to the requested reviewer.  
    - The reviewer should suggest any possible changes in which case the pipeline will be re run once the said changes have been made or they can approve the pull request and merge.



    - Manual Review:
        - Request a review, a message will be sent via email and slack
    - Manual Review:
        - Request a review, a message will be sent via email and slack

### Diagram:



## What Works What Doesn't