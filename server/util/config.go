package util

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
)

type Config struct {
	Server struct {
		JwtSecret struct {
			File  string `yaml:"file"`
			Admin string `yaml:"admin"`
		}
	}
	Admin struct {
		Password string `yaml:"password"`
	}
}

var (
	ConfigFile *Config
)

func InitConfig() {
	ConfigFile = GetConfig()
}

func GetConfig() *Config {
	file, err := ioutil.ReadFile("./configs/main.yml")
	if err != nil {
		log.Fatal(err)
	}

	config := &Config{}
	err = yaml.Unmarshal(file, &config)
	if err != nil {
		log.Fatal(err)
	}

	return config
}