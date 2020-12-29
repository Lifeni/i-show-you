package util

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
)

type Config struct {
	Database struct {
		Host string `yaml:"host"`
		Port string `yaml:"port"`
	} `yaml:"database"`

	App struct {
		History struct {
			Enable     bool `yaml:"enable"`
			SavePeriod int  `yaml:"save_period"`
		} `yaml:"history"`

		Admin struct {
			Enable    bool `yaml:"enable"`
			TryCount  int  `yaml:"try_count"`
			BanPeriod int  `yaml:"ban_period"`
		} `yaml:"admin"`
	} `yaml:"app"`

	Secret struct {
		JwtKey struct {
			File  string `yaml:"file"`
			Admin string `yaml:"admin"`
		} `yaml:"kwt_key"`

		Admin string `yaml:"admin"`
	} `yaml:"secret"`
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
