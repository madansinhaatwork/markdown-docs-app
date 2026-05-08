pipeline {
    agent any

    environment {
        IMAGE_NAME = "vite-react-app-image"
        CONTAINER_NAME = "vite-react-app-container"
        APP_PORT = "3001"
        APP_DIR = "."
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                    echo "Node version:"
                    node -v || true

                    echo "NPM version:"
                    npm -v || true

                    echo "Docker version:"
                    docker -v

                    echo "Current workspace directory:"
                    pwd

                    echo "Workspace files:"
                    ls -la

                    echo "Application folder files:"
                    ls -la $APP_DIR
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        echo "Installing dependencies inside:"
                        pwd
                        npm install
                    '''
                }
            }
        }

        stage('Build React App') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        echo "Building React app inside:"
                        pwd
                        npm run build
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        echo "Building Docker image inside:"
                        pwd
                        docker build -t $IMAGE_NAME:latest .
                    '''
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                    docker run -d \
                    --name $CONTAINER_NAME \
                    -p $APP_PORT:80 \
                    --restart unless-stopped \
                    $IMAGE_NAME:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    docker ps | grep $CONTAINER_NAME
                '''
            }
        }

        stage('Cleanup Docker') {
            steps {
                sh '''
                    docker image prune -f
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully. React app deployed.'
        }

        failure {
            echo 'CI/CD pipeline failed. Check console output.'
        }
    }
}