syntax on
filetype plugin on


let mapleader = "-"


set nu
"set rnu

"autocmd InsertEnter * :setlocal nornu 
"autocmd InsertEnter * :setlocal nu 
"autocmd InsertEnter * :redraw!


"autocmd InsertLeave * :setlocal rnu 
"autocmd InsertLeave * :redraw!


set background=dark

set autoindent

set tabpagemax=80

set expandtab
set smarttab

set ruler

set foldmethod=syntax
set foldlevel=99
set hidden
set softtabstop=3
set tabstop=3
set shiftwidth=3
" Always show the status bar (windowname %of_page)
set laststatus=2

set cursorline
set nowrap
set backspace=indent,eol,start
inoremap jk <esc>
inoremap kj <esc>
noremap ; :

noremap <C-D> :!bash<cr>
"nnoremap <leader>bk :bp\|bd #<cr>

" :bk -> buffer kill, delete this buffer and replace the window contents
"        with that of the previous buffer
cnoreabbrev <expr> bk ((getcmdtype() is# ':' && getcmdline() is#'bk')?('bp\|bd #<cr>'):('bk'))

hi StatusLine   ctermfg=255 ctermbg=23  cterm=bold 
hi StatusLineNC ctermfg=249 ctermbg=237 cterm=none 


if !exists(':Son')
   command Son set spelllang=en_ca spell
   command Soff set nospell
endif

" allow ctrl-w to act normaly in insert mode, I do not care for word deletion
inoremap <C-w><C-w> <esc><C-w><C-w>

nnoremap <leader>s :source<Space>$MYVIMRC<cr>
nnoremap <leader>e :ls<cr>:edit<Space>#
nnoremap <leader>c I//   <esc>A   //<esc>Yp^k$r/p

