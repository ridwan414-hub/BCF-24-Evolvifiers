REGISTRY=fazlulkarim105925
VERSION=latest

.PHONY: all build tag push

all: build tag push

build:
	docker build -t api-gateway:$(VERSION) ./api-gateway
	docker build -t auth-service:$(VERSION) ./auth-service
	docker build -t train-service:$(VERSION) ./train-service

tag:
	docker tag api-gateway:$(VERSION) $(REGISTRY)/api-gateway:$(VERSION)
	docker tag auth-service:$(VERSION) $(REGISTRY)/auth-service:$(VERSION)
	docker tag train-service:$(VERSION) $(REGISTRY)/train-service:$(VERSION)

push:
	docker push $(REGISTRY)/api-gateway:$(VERSION)
	docker push $(REGISTRY)/auth-service:$(VERSION)
	docker push $(REGISTRY)/train-service:$(VERSION)

clean:
	docker rmi api-gateway:$(VERSION) $(REGISTRY)/api-gateway:$(VERSION)
	docker rmi auth-service:$(VERSION) $(REGISTRY)/auth-service:$(VERSION)
	docker rmi train-service:$(VERSION) $(REGISTRY)/train-service:$(VERSION)