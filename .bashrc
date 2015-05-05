#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# set up custom colors
eval "$(dircolors ~/.dircolors)";

# disable CTRL-s sending XOFF to kernel
stty -ixon

# update path
export PATH=$HOME/bin:$HOME/sys161/bin:$HOME/sys161/tools/bin:$HOME/.cabal/bin:$PATH
# set editor
export EDITOR=vim


# set cscope (will later create a script to automate this)
export CSCOPE_DB=/home/dlangevi/cs350/os161/os161-1.99/cscope_os161


alias vi='vim' # hehehe
alias t='./.todo/todo.sh'
alias stalk='ldapsearch -x -h uwladp.uwaterloo.ca -b "dc=uwaterloo,dc=ca"'


# listen on nullsleep,  ncmpcpp (mpd) output port
alias cscradio='mplayer http://nullsleep.csclub.uwaterloo.ca:9876'

alias ls='ls --color=auto'

PS1='[\u@\h \W]\$ '

#
#alias startx='startx &> ~/.xlog'

bat () {
    if [ ! $# == 1 ]; then
        upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep -E "state|to\ full|percentage|time\ to\ empty"
    else
        upower -i /org/freedesktop/UPower/devices/battery_BAT0 
    fi
}

eduroam () {

    netctl list | grep eudroam$

    if [ $? == 1 ]; then
        echo "Not enabled"
        sudo netctl enable wlp1s0-eduroam
    
    fi

    sudo netctl start wlp1s0-eduroam
}

alias mntwhat='sshfs -o idmap=user dlangevi@chicken.whatbox.ca: ~/whatbox'
