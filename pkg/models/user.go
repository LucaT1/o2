package models

import (
	"crypto/md5"
	"fmt"
	"strings"

	"github.com/jinzhu/gorm"
)

// User is the database model for a user
type User struct {
	Base

	Email    string `gorm:"type:varchar(100);unique_index" json:"email"`
	Username string `gorm:"type:varchar(32);unique_index" json:"username"`
	Password string `json:"-"`

	Firstname   string `gorm:"type:varchar(50)" json:"firstname"`
	Lastname    string `gorm:"type:varchar(50)" json:"lastname"`
	Description string `gorm:"type:varchar(250)" json:"description"`
	Location    string `gorm:"type:varchar(100)" json:"location"`
	Picture     string `json:"picture"`

	Repositories []Repository `gorm:"foreignkey:OwnerName;association_foreignkey:Username" json:"repositories"`
}

// Picture generates the picture url of a profile picture
func Picture(email string) string {
	hash := md5.Sum([]byte(strings.ToLower(email)))
	return "https://www.gravatar.com/avatar/" + fmt.Sprintf("%x", hash)
}

// BeforeSave will generate the profile picture url from gravatar
func (user *User) BeforeSave(scope *gorm.Scope) error {
	return scope.SetColumn("Picture", Picture(user.Email))
}
