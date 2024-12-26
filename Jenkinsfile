pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'docker_hub_cred' // Docker Hub credentials ID
        //DOCKER_REPO_FRONTEND = 'logicloom2/frontend-image'
        DOCKER_REPO_BACKEND = 'logicloom2/ceylontravellife-backend'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Pull the latest code from the Git repository
                git branch: 'main', url: 'https://github.com/dltmthilina/travel-srilanka'
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    // Navigate to the backend folder and build Docker image
                    bat 'cd backend && docker build -t $DOCKER_REPO_BACKEND:latest .'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                script {
                    // Login to Docker Hub and push the backend image
                    withDockerRegistry([credentialsId: DOCKERHUB_CREDENTIALS, url: '']) {
                        bat 'docker push $DOCKER_REPO_BACKEND:latest'
                    }
                }
            }
        }

       /*  stage('Build Frontend Image') {
            steps {
                script {
                    // Navigate to the frontend folder and build Docker image
                    sh 'cd frontend && docker build -t $DOCKER_REPO_FRONTEND:latest .'
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {
                    // Login to Docker Hub and push the frontend image
                    withDockerRegistry([credentialsId: DOCKERHUB_CREDENTIALS, url: '']) {
                        sh 'docker push $DOCKER_REPO_FRONTEND:latest'
                    }
                }
            }
        } */
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
