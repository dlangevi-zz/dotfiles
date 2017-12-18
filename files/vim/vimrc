call plug#begin()
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-surround'
Plug 'octol/vim-cpp-enhanced-highlight'
Plug 'scrooloose/nerdtree'
Plug 'christoomey/vim-tmux-navigator'
Plug 'henrik/vim-indexed-search'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'Yggdroot/indentLine'
call plug#end()

set nocompatible " be iMproved
syntax on
filetype plugin indent on    " required

if filereadable(expand("~/.vimrc.local"))
  source ~/.vimrc.local
endif

" Global config
let mapleader = "-"
set shell=/bin/zsh\ -l

set background=dark

set nu
set cursorline

" Show information at screen bottom
set laststatus=2
set ruler
set rulerformat=%-14.(%l,%c%V%)\ %P
" Active colors
hi StatusLine   ctermfg=lightcyan ctermbg=darkgrey cterm=bold 
" Inactive colors
hi StatusLineNC ctermfg=grey ctermbg=darkgrey cterm=bold

" Quality of life
set nowrap
set backspace=indent,eol,start

set wildmode=longest,list,full
set wildmenu

set textwidth=80
set tabpagemax=80
set autoindent
set expandtab
set smarttab

set noswapfile
set mouse=

" Folds
set foldmethod=syntax
set foldlevel=3

" Allow for unwritten changes in hidden buffers
set hidden

set softtabstop=2
set tabstop=2
set shiftwidth=2

inoremap jk <esc>
" inoremap kj <esc> someone has this in their username :'(
inoremap jj <esc>
inoremap kk <esc>
noremap ; :

let g:cpp_class_scope_highlight = 1
let g:cpp_class_decl_highlight = 1
let g:cpp_experimental_template_highlight = 1

" Nerdtree
let NERDTreeHijackNetrw=1

map <C-n> :NERDTreeToggle<CR>


" :bk -> buffer kill, delete this buffer and replace 
"                     the window contents with that 
"                     of the previous buffer 
"                     (removes entry from ls)
cnoreabbrev <expr> bk ((getcmdtype() is# ':' && getcmdline() is#'bk')?('bp\|bd #<cr>'):('bk'))

" Command to toggle spell highlighting
if !exists(':Son')
  command Son set spelllang=en_ca spell
  command Soff set nospell
endif

" allow ctrl-w to act normaly in insert mode, 
inoremap <C-w><C-w> <esc><C-w><C-w>

" resource vimrc
nnoremap <leader>s :source<Space>$MYVIMRC<cr>
nnoremap <leader>t :Files<cr>
nnoremap <leader>e :Buffers<cr>
nnoremap <leader>o :e .<CR>
nnoremap <leader>a :A<CR>
nnoremap <leader><leader> :edit<Space>#<cr>
nnoremap <leader>f :edit<Space>.<cr>

" YCM must use the same Python version it's linked against
let g:ycm_path_to_python_interpreter = '/data/users/dlangevi/fbsource/fbcode/third-party-buck/gcc-5-glibc-2.23/build/python/2.7/bin/python2.7'
" Default ycm_extra_conf.py for fbcode
let g:ycm_global_ycm_extra_conf = '/home/dlangevi/.vim/bundle/YouCompleteMe/ycm_extra_conf_fbcode.py'

autocmd BufRead,BufNew *.sh setlocal textwidth=0
